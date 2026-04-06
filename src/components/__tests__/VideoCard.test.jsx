import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ToastProvider } from '@/components/ui/toast';
import VideoCard from '../VideoCard';

function VideoCardWrapper(props) {
  return (
    <ToastProvider>
      <VideoCard {...props} />
    </ToastProvider>
  );
}

describe('VideoCard', () => {
  const mockVideo = {
    id: 'test-video-id',
    title: 'Test Video Title',
    duration: '15:30',
  };
  const mockModuleId = 1;
  const mockOnMarkComplete = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render video card with correct content', () => {
    render(
      <VideoCardWrapper
        video={mockVideo}
        moduleId={mockModuleId}
        isCompleted={false}
        onMarkComplete={mockOnMarkComplete}
      />
    );

    expect(screen.getByText('Test Video Title')).toBeInTheDocument();
    expect(screen.getByText('15:30')).toBeInTheDocument();
    expect(screen.getByText('Watch Video')).toBeInTheDocument();
    expect(screen.getByText('Mark as watched')).toBeInTheDocument();
  });

  it('should show completed state', () => {
    render(
      <VideoCardWrapper
        video={mockVideo}
        moduleId={mockModuleId}
        isCompleted={true}
        onMarkComplete={mockOnMarkComplete}
      />
    );

    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeChecked();
  });

  it('should call onMarkComplete when checkbox is changed', async () => {
    const user = userEvent.setup();

    render(
      <VideoCardWrapper
        video={mockVideo}
        moduleId={mockModuleId}
        isCompleted={false}
        onMarkComplete={mockOnMarkComplete}
      />
    );

    const checkbox = screen.getByRole('checkbox');
    await user.click(checkbox);

    expect(mockOnMarkComplete).toHaveBeenCalledWith(mockModuleId, mockVideo.id, true);
  });

  it('should call openVideoWindow when thumbnail is clicked', async () => {
    const user = userEvent.setup();

    render(
      <VideoCardWrapper
        video={mockVideo}
        moduleId={mockModuleId}
        isCompleted={false}
        onMarkComplete={mockOnMarkComplete}
      />
    );

    const thumbnail = screen.getByAltText('Test Video Title');
    await user.click(thumbnail);

    expect(window.electronAPI.openVideoWindow).toHaveBeenCalledWith(mockVideo.id, mockModuleId);
  });

  it('should call openVideoWindow when watch button is clicked', async () => {
    const user = userEvent.setup();

    render(
      <VideoCardWrapper
        video={mockVideo}
        moduleId={mockModuleId}
        isCompleted={false}
        onMarkComplete={mockOnMarkComplete}
      />
    );

    const watchButton = screen.getByText('Watch Video');
    await user.click(watchButton);

    expect(window.electronAPI.openVideoWindow).toHaveBeenCalledWith(mockVideo.id, mockModuleId);
  });

  it('should show loading state', () => {
    global.window.electronAPI.openVideoWindow.mockImplementation(
      () => new Promise(resolve => setTimeout(() => resolve({ success: true }), 100))
    );

    render(
      <VideoCardWrapper
        video={mockVideo}
        moduleId={mockModuleId}
        isCompleted={false}
        onMarkComplete={mockOnMarkComplete}
      />
    );

    const thumbnail = screen.getByAltText('Test Video Title');
    fireEvent.click(thumbnail);

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('should show error state on failed video load', async () => {
    global.window.electronAPI.openVideoWindow.mockRejectedValue(new Error('Network error'));

    render(
      <VideoCardWrapper
        video={mockVideo}
        moduleId={mockModuleId}
        isCompleted={false}
        onMarkComplete={mockOnMarkComplete}
      />
    );

    const thumbnail = screen.getByAltText('Test Video Title');
    await fireEvent.click(thumbnail);

    await waitFor(() => {
      const videoCard = screen.getByText('Test Video Title').closest('.video-card');
      expect(videoCard).toHaveClass('video-error');
    });
  });

  it('should disable watch button during loading', () => {
    global.window.electronAPI.openVideoWindow.mockImplementation(
      () => new Promise(resolve => setTimeout(() => resolve({ success: true }), 100))
    );

    render(
      <VideoCardWrapper
        video={mockVideo}
        moduleId={mockModuleId}
        isCompleted={false}
        onMarkComplete={mockOnMarkComplete}
      />
    );

    const thumbnail = screen.getByAltText('Test Video Title');
    fireEvent.click(thumbnail);

    const watchButton = screen.getByText('Opening...');
    expect(watchButton).toBeDisabled();
  });

  it('should be keyboard accessible', () => {
    render(
      <VideoCardWrapper
        video={mockVideo}
        moduleId={mockModuleId}
        isCompleted={false}
        onMarkComplete={mockOnMarkComplete}
      />
    );

    const thumbnailWrapper = screen
      .getByAltText('Test Video Title')
      .closest('.video-thumbnail-container');
    expect(thumbnailWrapper).toHaveAttribute('role', 'button');
    expect(thumbnailWrapper).toHaveAttribute('tabIndex', '0');
    expect(thumbnailWrapper).toHaveAttribute('aria-label', 'Play video: Test Video Title');
  });

  it('should handle Enter key press', async () => {
    const user = userEvent.setup();

    render(
      <VideoCardWrapper
        video={mockVideo}
        moduleId={mockModuleId}
        isCompleted={false}
        onMarkComplete={mockOnMarkComplete}
      />
    );

    const thumbnail = screen.getByAltText('Test Video Title');
    await user.keyboard('[Tab][Enter]');

    expect(window.electronAPI.openVideoWindow).toHaveBeenCalled();
  });
});
