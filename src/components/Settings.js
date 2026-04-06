import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { FolderOpen, LayoutDashboard, Database, Palette, Info } from 'lucide-react';
import ResourcesPathTab from './settings/ResourcesPathTab';
import DashboardTab from './settings/DashboardTab';
import DataManagementTab from './settings/DataManagementTab';
import ThemeTab from './settings/ThemeTab';
import AboutTab from './settings/AboutTab';
import '../styles/Settings.css';

function Settings({ open, onOpenChange }) {
  const [activeTab, setActiveTab] = useState('resources');

  const tabs = [
    { id: 'resources', label: 'Resources Path', Icon: FolderOpen },
    { id: 'dashboard', label: 'Dashboard', Icon: LayoutDashboard },
    { id: 'theme', label: 'Theme', Icon: Palette },
    { id: 'data', label: 'Data Management', Icon: Database },
    { id: 'about', label: 'About', Icon: Info },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="settings-dialog">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
        </DialogHeader>

        <div className="settings-container">
          {/* Tab Navigation */}
          <div className="settings-tabs">
            {tabs.map(tab => {
              const IconComponent = tab.Icon;
              return (
                <button
                  key={tab.id}
                  className={`settings-tab ${activeTab === tab.id ? 'active' : ''}`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  <IconComponent className="tab-icon" size={20} />
                  <span className="tab-label">{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Tab Content */}
          <div className="settings-content">
            {activeTab === 'resources' && <ResourcesPathTab />}
            {activeTab === 'dashboard' && <DashboardTab />}
            {activeTab === 'theme' && <ThemeTab />}
            {activeTab === 'data' && <DataManagementTab />}
            {activeTab === 'about' && <AboutTab />}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default Settings;
