export interface Repository {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  private: boolean;
  fork: boolean;
  archived: boolean;
  created_at: string | null;
  updated_at: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  organization?: {
    login: string;
    avatar_url: string;
  };
}
