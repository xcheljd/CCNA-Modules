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
    openYoutubeSignin: jest.fn().mockResolvedValue({ success: true }),
    getYoutubeSigninStatus: jest.fn().mockResolvedValue({ signedIn: false }),
    signOutYoutube: jest.fn().mockResolvedValue({ success: true }),
    onYoutubeSigninChanged: jest.fn(() => () => {}),
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
    expect(screen.getByText('YouTube')).toBeInTheDocument();
    expect(screen.getByText('Data Management')).toBeInTheDocument();
    expect(screen.getByText('About')).toBeInTheDocument();
  });

  it('should set first tab as active by default', async () => {
    await act(async () => {
      render(<SettingsWrapper open={true} onOpenChange={jest.fn()} />);
    });

    const tabs = screen.getAllByRole('tab');
    const firstTab = tabs.find(tab => tab.textContent?.includes('Resources'));

    expect(firstTab).toHaveClass('settings-tab');
    expect(firstTab).toHaveAttribute('data-state', 'active');
  });

  it('should switch tabs when clicked', async () => {
    const user = userEvent.setup();
    await act(async () => {
      render(<SettingsWrapper open={true} onOpenChange={jest.fn()} />);
    });

    const themeTab = screen.getByRole('tab', { name: /Theme/ });
    await user.click(themeTab);

    expect(themeTab).toHaveClass('settings-tab');
    expect(themeTab).toHaveAttribute('data-state', 'active');
  });

  describe('YouTube tab', () => {
    async function openYoutubeTab(user) {
      await act(async () => {
        render(<SettingsWrapper open={true} onOpenChange={jest.fn()} />);
      });
      await user.click(screen.getByRole('tab', { name: /YouTube/ }));
    }

    it('shows Not signed in and a Sign in button when status is signed-out', async () => {
      window.electronAPI.getYoutubeSigninStatus.mockResolvedValueOnce({ signedIn: false });
      const user = userEvent.setup();
      await openYoutubeTab(user);

      expect(await screen.findByText(/Not signed in/)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Sign in to YouTube/ })).toBeInTheDocument();
    });

    it('invokes openYoutubeSignin when Sign in is clicked', async () => {
      window.electronAPI.getYoutubeSigninStatus.mockResolvedValueOnce({ signedIn: false });
      const user = userEvent.setup();
      await openYoutubeTab(user);

      const signInBtn = await screen.findByRole('button', { name: /Sign in to YouTube/ });
      await user.click(signInBtn);

      expect(window.electronAPI.openYoutubeSignin).toHaveBeenCalledTimes(1);
    });

    it('shows Sign out and calls signOutYoutube when already signed in', async () => {
      window.electronAPI.getYoutubeSigninStatus.mockResolvedValueOnce({ signedIn: true });
      const user = userEvent.setup();
      await openYoutubeTab(user);

      const signOutBtn = await screen.findByRole('button', { name: /Sign out/ });
      await user.click(signOutBtn);

      // Confirm in the AlertDialog
      const confirmBtn = await screen.findByRole('button', { name: /sign out/i });
      await user.click(confirmBtn);

      expect(window.electronAPI.signOutYoutube).toHaveBeenCalledTimes(1);
    });

    it('does not sign out when the user cancels the confirm dialog', async () => {
      window.electronAPI.getYoutubeSigninStatus.mockResolvedValueOnce({ signedIn: true });
      const user = userEvent.setup();
      await openYoutubeTab(user);

      const signOutBtn = await screen.findByRole('button', { name: /Sign out/ });
      await user.click(signOutBtn);

      // Cancel the AlertDialog
      const cancelBtn = await screen.findByRole('button', { name: /cancel/i });
      await user.click(cancelBtn);

      expect(window.electronAPI.signOutYoutube).not.toHaveBeenCalled();
    });
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
