import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { FolderOpen, LayoutDashboard, Database, Palette, Info, Video } from 'lucide-react';
import ResourcesPathTab from './settings/ResourcesPathTab';
import DashboardTab from './settings/DashboardTab';
import DataManagementTab from './settings/DataManagementTab';
import ThemeTab from './settings/ThemeTab';
import AboutTab from './settings/AboutTab';
import YoutubeTab from './settings/YoutubeTab';
import '../styles/Settings.css';

function Settings({ open, onOpenChange }) {
  const tabs = [
    { id: 'resources', label: 'Resources Path', Icon: FolderOpen, Component: ResourcesPathTab },
    { id: 'dashboard', label: 'Dashboard', Icon: LayoutDashboard, Component: DashboardTab },
    { id: 'theme', label: 'Theme', Icon: Palette, Component: ThemeTab },
    { id: 'youtube', label: 'YouTube', Icon: Video, Component: YoutubeTab },
    { id: 'data', label: 'Data Management', Icon: Database, Component: DataManagementTab },
    { id: 'about', label: 'About', Icon: Info, Component: AboutTab },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="settings-dialog">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
          <DialogDescription>
            Configure your CCNA course preferences, resources, and data management options.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="resources" className="settings-container">
          <TabsList className="settings-tabs">
            {tabs.map(({ id, label, Icon }) => (
              <TabsTrigger key={id} value={id} className="settings-tab">
                <Icon className="tab-icon" size={20} />
                <span className="tab-label">{label}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          {tabs.map(({ id, Component }) => (
            <TabsContent key={id} value={id} className="settings-content">
              <Component />
            </TabsContent>
          ))}
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

export default Settings;
