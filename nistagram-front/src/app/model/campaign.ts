export class Campaign{
    id: number;
	username: string;
	createdAt: Date;
	start: Date;
	end: Date;
	showNumber: number;
	targetAgeFrom: number;
	targetAgeTo: number;
	influensers: string[];
	editFor: number;
  }