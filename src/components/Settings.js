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
      <DialogContent className="settings-dialog max-w-3xl data-[state=open]:animate-[blurBounceIn_0.4s_cubic-bezier(0.34,1.56,0.64,1)] data-[state=closed]:zoom-out-95">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
          <DialogDescription>
            Configure your CCNA course preferences, resources, and data management options.
          </DialogDescription>
        </DialogHeader>

        <Tabs
          defaultValue="resources"
          className="flex flex-col min-h-[600px] max-h-[calc(90vh-150px)] mt-1"
        >
          <TabsList className="flex flex-wrap gap-1 bg-muted/30 p-1 rounded-xl mb-4">
            {tabs.map(({ id, label, Icon }) => (
              <TabsTrigger
                key={id}
                value={id}
                className="settings-tab flex items-center justify-center gap-2 flex-auto min-w-0 px-3.5 py-2.5 bg-transparent border-none rounded-lg cursor-pointer transition-all duration-300 text-muted-foreground font-medium relative whitespace-nowrap hover:bg-muted/60 hover:text-foreground"
              >
                <Icon className="shrink-0" size={20} />
                <span className="tab-label">{label}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          {tabs.map(({ id, Component }) => (
            <TabsContent
              key={id}
              value={id}
              className="flex-1 overflow-y-auto pr-2 pb-4 pt-0 animate-[fadeInSubtle_0.3s_ease-in]"
            >
              <Component />
            </TabsContent>
          ))}
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

export default Settings;
