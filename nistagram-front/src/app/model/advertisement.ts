export class Advertisement{
    id: number;
    campaignId: number;
	publicationId: number;
	publicationType: number;
    username: string;
    location_name: string;
    description: string;
    createdAt: string;
    hashtags: string[];
    tags: string[];
    imageUrls: string[];
    numberOfLikes: number;
    numberOfDislikes: number;
    comments: string[];
    link: string;
    userProfilePic: string;
  }