
export interface Student {
  id: string;
  studentId: string;
  firstName: string;
  lastName: string;
  nickname: string;
  phone: string;
  facebook: string;
  instagram: string;
  imageUrl: string;
  quote?: string;
  year: string;
}

export interface AppConfig {
  scriptUrl: string;
  apiKey?: string;
}
