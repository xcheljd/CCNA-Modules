import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import GoalTracker from '../utils/goalTracker';

function GoalModal({ open, onOpenChange, onCreate }) {
  const [selectedPreset, setSelectedPreset] = useState('moderate');
  const [type, setType] = useState('weekly');
  const presets = GoalTracker.getPresets();

  const handleCreate = () => {
    const preset = presets[selectedPreset];
    const targets = type === 'monthly' ? preset.monthly : preset.weekly;
    onCreate({
      type,
      targets,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-3xl data-[state=open]:animate-[blurBounceIn_0.4s_cubic-bezier(0.34,1.56,0.64,1)] sm:rounded-xl max-h-[80vh] overflow-y-auto"
      >
        <DialogHeader>
          <DialogTitle className="text-xl">Create Learning Goal</DialogTitle>
          <DialogDescription className="sr-only">
            Choose a duration and preset for your learning goal
          </DialogDescription>
        </DialogHeader>

        <div className="mb-2">
          <label className="block text-sm font-medium text-muted-foreground mb-1">Duration</label>
          <Select value={type} onValueChange={setType}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-1 gap-3">
          {Object.entries(presets).map(([key, preset]) => (
            <div
              key={key}
              className={`p-4 rounded-lg border-2 cursor-pointer transition-all ease-[cubic-bezier(0.25,0.1,0.25,1)] ${
                selectedPreset === key
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:border-ring'
              }`}
              onClick={() => setSelectedPreset(key)}
              role="radio"
              aria-checked={selectedPreset === key}
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setSelectedPreset(key);
                }
              }}
            >
              <h4 className="text-foreground font-semibold m-0 mb-1">{preset.name}</h4>
              <p className="text-sm text-muted-foreground m-0 mb-2">{preset.description}</p>
              <div className="flex gap-3 text-xs text-muted-foreground">
                <span className="px-2 py-1 bg-muted rounded">
                  {preset[type].modulesCompleted} modules
                </span>
                <span className="px-2 py-1 bg-muted rounded">
                  {preset[type].videosWatched} videos
                </span>
              </div>
            </div>
          ))}
        </div>

        <DialogFooter>
          <Button variant="secondary" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleCreate}>Create Goal</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default GoalModal;
