/* global queueMicrotask, File */

import React from 'react';
import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DataManagementTab from '../settings/DataManagementTab';
import { ToastProvider } from '../../components/ui/toast';

function renderTab() {
  return render(
    <ToastProvider>
      <DataManagementTab />
    </ToastProvider>
  );
}

// Stub FileReader so readAsText resolves synchronously with a provided payload
function installFileReaderStub(payloadText) {
  const instances = [];
  window.FileReader = class {
    constructor() {
      this.onload = null;
      this.onerror = null;
      instances.push(this);
    }
    readAsText() {
      // Simulate async file read
      queueMicrotask(() => {
        if (this.onload) {
          this.onload({ target: { result: payloadText } });
        }
      });
    }
  };
  return instances;
}

// Drive the hidden <input type="file"> created by handleImport by intercepting
// document.createElement for the duration of the click.
function interceptFileInput(file) {
  const realCreate = document.createElement.bind(document);
  const spy = jest.spyOn(document, 'createElement').mockImplementation(tag => {
    const el = realCreate(tag);
    if (tag === 'input') {
      // After user code sets onchange, we invoke it synchronously when .click() is called
      el.click = () => {
        if (typeof el.onchange === 'function') {
          el.onchange({ target: { files: [file] } });
        }
      };
    }
    return el;
  });
  return spy;
}

describe('DataManagementTab - import pipeline', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('ignores non-progress keys in a malicious backup after user confirms', async () => {
    const user = userEvent.setup();

    // Pre-seed values that the backup must not overwrite
    localStorage.setItem('app-settings', '{"original":true}');
    localStorage.setItem('schema-version', '1');

    const maliciousBackup = {
      exportVersion: '1.0',
      exportDate: '2026-01-01T00:00:00Z',
      data: {
        progress: {
          video_1_v1_completed: 'true',
          confidence_2: '5',
          // Attacker-injected keys:
          'app-settings': '{"malicious":true}',
          'schema-version': '99',
          'app-theme': 'evil',
        },
      },
      metadata: { progressKeys: 2 },
    };

    const file = new File([JSON.stringify(maliciousBackup)], 'backup.json', {
      type: 'application/json',
    });

    installFileReaderStub(JSON.stringify(maliciousBackup));
    const createSpy = interceptFileInput(file);

    renderTab();

    await act(async () => {
      await user.click(screen.getByRole('button', { name: /Import Progress/i }));
    });

    // Confirmation dialog should appear
    expect(await screen.findByText('Import Backup?')).toBeInTheDocument();

    await act(async () => {
      await user.click(screen.getByRole('button', { name: /^Import$/ }));
    });

    // Legitimate progress keys imported
    expect(localStorage.getItem('video_1_v1_completed')).toBe('true');
    expect(localStorage.getItem('confidence_2')).toBe('5');

    // Pre-seeded non-progress keys untouched
    expect(localStorage.getItem('app-settings')).toBe('{"original":true}');
    expect(localStorage.getItem('schema-version')).toBe('1');

    // Attacker-injected non-progress keys not written
    expect(localStorage.getItem('app-theme')).toBeNull();

    createSpy.mockRestore();
  });

  it('cancel button dismisses the dialog without writing any keys', async () => {
    const user = userEvent.setup();

    const backup = {
      exportVersion: '1.0',
      exportDate: '2026-01-01T00:00:00Z',
      data: { progress: { video_1_v1_completed: 'true' } },
      metadata: { progressKeys: 1 },
    };

    const file = new File([JSON.stringify(backup)], 'backup.json', {
      type: 'application/json',
    });

    installFileReaderStub(JSON.stringify(backup));
    const createSpy = interceptFileInput(file);

    renderTab();

    await act(async () => {
      await user.click(screen.getByRole('button', { name: /Import Progress/i }));
    });

    expect(await screen.findByText('Import Backup?')).toBeInTheDocument();

    await act(async () => {
      await user.click(screen.getByRole('button', { name: /Cancel/i }));
    });

    expect(localStorage.getItem('video_1_v1_completed')).toBeNull();

    createSpy.mockRestore();
  });
});
