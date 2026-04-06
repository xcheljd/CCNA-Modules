import React from 'react';
import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Settings from '../Settings';
import { ToastProvider } from '../../components/ui/toast';

// Mock electronAPI so ResourcesPathTab doesn't trigger unmocked async updates
beforeAll(() => {
  window.electronAPI = {
    getResourcesInfo: jest.fn().mockResolvedValue({
      currentPath: '/mock/resources',
      customPath: null,
      exists: true,
      isCustom: false,
    }),
    selectResourcesFolder: jest.fn().mockResolvedValue({ success: false }),
    resetResourcesPath: jest.fn().mockResolvedValue({ success: true }),
    openExternalUrl: jest.fn().mockResolvedValue({ success: true }),
    exportProgressBackup: jest.fn().mockResolvedValue({ success: true }),
  };
});

afterAll(() => {
  delete window.electronAPI;
});

function SettingsWrapper(props) {
  return (
    <ToastProvider>
      <Settings {...props} />
    </ToastProvider>
  );
}

describe('Settings', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render when open', async () => {
    await act(async () => {
      render(<SettingsWrapper open={true} onOpenChange={jest.fn()} />);
    });

    expect(screen.getByText('Settings')).toBeInTheDocument();
    expect(screen.getByRole('dialog')).toBeVisible();
  });

  it('should not render when closed', () => {
    render(<SettingsWrapper open={false} onOpenChange={jest.fn()} />);

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('should display all tabs', async () => {
    await act(async () => {
      render(<SettingsWrapper open={true} onOpenChange={jest.fn()} />);
    });

    expect(screen.getByText('Resources Path')).toBeInTheDocument();
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Theme')).toBeInTheDocument();
    expect(screen.getByText('Data Management')).toBeInTheDocument();
    expect(screen.getByText('About')).toBeInTheDocument();
  });

  it('should set first tab as active by default', async () => {
    await act(async () => {
      render(<SettingsWrapper open={true} onOpenChange={jest.fn()} />);
    });

    const tabs = screen.getAllByRole('button');
    const firstTab = tabs.find(tab => tab.textContent?.includes('Resources'));

    expect(firstTab).toHaveClass('settings-tab');
    expect(firstTab).toHaveClass('active');
  });

  it('should switch tabs when clicked', async () => {
    const user = userEvent.setup();
    await act(async () => {
      render(<SettingsWrapper open={true} onOpenChange={jest.fn()} />);
    });

    const themeTab = screen.getByText('Theme');
    await user.click(themeTab);

    const themeButton = themeTab.closest('button');
    expect(themeButton).toHaveClass('settings-tab');
    expect(themeButton).toHaveClass('active');
  });

  it('should close when pressing Escape', async () => {
    const user = userEvent.setup();
    const onOpenChange = jest.fn();
    await act(async () => {
      render(<SettingsWrapper open={true} onOpenChange={onOpenChange} />);
    });

    await user.keyboard('{Escape}');

    expect(onOpenChange).toHaveBeenCalledWith(false);
  });
});
