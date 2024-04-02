import { Dispatch, SetStateAction } from 'react';
import { Command } from '../../services';
import { TrafficRestrictionData } from '../TrafficRestriction';

export class AddTrafficRestrictionCommand implements Command {
  constructor(
    private modifier: Dispatch<SetStateAction<TrafficRestrictionData[]>>,
    private trafficRestrictionData: TrafficRestrictionData
  ) {}
  execute(): void {
    this.modifier((t) => [...t, this.trafficRestrictionData]);
  }

  undo(): void {
    this.modifier((t) => t.filter((o) => o.id !== this.trafficRestrictionData.id));
  }
}

export class RemoveTrafficRestrictionCommand implements Command {
  constructor(
    private modifier: Dispatch<SetStateAction<TrafficRestrictionData[]>>,
    private trafficRestrictionId: string
  ) {}

  // Copied of removed traffic restriction
  private removedTrafficRestriction: TrafficRestrictionData | undefined;

  execute(): void {
    this.modifier((t) => {
      this.removedTrafficRestriction = t.find((o) => o.id === this.trafficRestrictionId);
      return t.filter((o) => o.id !== this.trafficRestrictionId);
    });
  }

  undo(): void {
    if (this.removedTrafficRestriction) {
      const trafficRestrictionData = this.removedTrafficRestriction;
      this.modifier((t) => [...t, trafficRestrictionData]);
    }
  }
}
