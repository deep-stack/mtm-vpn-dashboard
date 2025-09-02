import { ApiError } from './api';
import { formatFileSize, extractVersionFromTag } from './common';

// GitHub Releases API interfaces
export interface GitHubAsset {
  name: string;
  size: number;
  download_count: number;
  browser_download_url: string;
  created_at: string;
}

export interface GitHubAuthor {
  login: string;
  avatar_url: string;
}

export interface GitHubRelease {
  id: number;
  tag_name: string;
  name: string;
  body: string;
  created_at: string;
  published_at: string;
  author: GitHubAuthor;
  assets: GitHubAsset[];
}

export interface ProcessedRelease {
  id: string;
  version: string;
  downloads: number;
  releaseDate: Date;
  fileSize: string;
  downloadUrl: string;
  tagName: string;
}

export interface DownloadStats {
  totalDownloads: number;
  releases: ProcessedRelease[];
}

export const fetchGitHubReleases = async (): Promise<DownloadStats> => {
  const response = await fetch('/api/github/releases');
  if (!response.ok) {
    throw new ApiError(`Failed to fetch releases: ${response.statusText}`, response.status);
  }
  
  const releases: GitHubRelease[] = await response.json();
  
  const processedReleases = releases
    .filter(release => release.assets && release.assets.length > 0)
    .map(release => {
      // Find APK asset
      const apkAsset = release.assets.find(asset => asset.name.endsWith('.apk'));
      
      return {
        id: release.id.toString(),
        version: extractVersionFromTag(release.tag_name),
        downloads: apkAsset ? apkAsset.download_count : 0,
        releaseDate: new Date(release.published_at || release.created_at),
        fileSize: apkAsset ? formatFileSize(apkAsset.size) : 'Unknown',
        downloadUrl: apkAsset ? apkAsset.browser_download_url : '#',
        tagName: release.tag_name
      };
    })
    .sort((a, b) => b.releaseDate.getTime() - a.releaseDate.getTime());
  
  const totalDownloads = processedReleases.reduce((sum, release) => sum + release.downloads, 0);
  
  return {
    totalDownloads,
    releases: processedReleases
  };
};