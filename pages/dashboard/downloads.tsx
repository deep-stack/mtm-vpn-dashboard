import { useState, useEffect } from 'react';
import { 
  CloudArrowDownIcon, 
  DevicePhoneMobileIcon,
  ArrowTopRightOnSquareIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';

import Layout from '../../components/Layout';
import { ApiError } from '../../utils/api';
import { fetchGitHubReleases, ProcessedRelease } from '../../utils/downloads';

export default function Downloads() {
  const [releases, setReleases] = useState<ProcessedRelease[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const loadReleases = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const { releases } = await fetchGitHubReleases();
        setReleases(releases);
      } catch (err) {
        console.error('Failed to fetch releases:', err);
        setError(err instanceof ApiError ? err.message : 'Failed to load release data');
      } finally {
        setLoading(false);
      }
    };
    
    loadReleases();
  }, []);
  
  const totalDownloads = releases.reduce((sum, release) => sum + release.downloads, 0);

  return (
    <Layout>
      <div>
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-2xl font-semibold text-gray-900">App Downloads</h1>
            <p className="mt-2 text-sm text-gray-700">
              Monitor MTM VPN Android application downloads.
            </p>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="mt-6">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <CloudArrowDownIcon className="h-8 w-8 text-blue-500" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Total Downloads
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {loading ? (
                        <div className="animate-pulse bg-gray-200 h-6 w-20 rounded"></div>
                      ) : error ? (
                        <span className="text-red-600">Error</span>
                      ) : (
                        totalDownloads.toLocaleString()
                      )}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Version Details Table */}
        <div className="mt-8 flex flex-col">
          <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
              <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Version
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Downloads
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        File Size
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Release Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {loading ? (
                      Array.from({ length: 3 }).map((_, index) => (
                        <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="animate-pulse bg-gray-200 h-4 w-24 rounded"></div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="animate-pulse bg-gray-200 h-4 w-12 rounded"></div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="animate-pulse bg-gray-200 h-4 w-16 rounded"></div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="animate-pulse bg-gray-200 h-4 w-20 rounded"></div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="animate-pulse bg-gray-200 h-4 w-24 rounded"></div>
                          </td>
                        </tr>
                      ))
                    ) : error ? (
                      <tr>
                        <td colSpan={5} className="px-6 py-8 whitespace-nowrap text-sm text-gray-500 text-center">
                          <div className="flex flex-col items-center">
                            <ExclamationTriangleIcon className="h-12 w-12 text-red-400" />
                            <h3 className="mt-2 text-sm font-medium text-gray-900">Error Loading Releases</h3>
                            <p className="mt-1 text-sm text-red-600">{error}</p>
                          </div>
                        </td>
                      </tr>
                    ) : releases.length > 0 ? (
                      releases.map((release, index) => (
                        <tr key={release.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {release.version}
                          </td>

                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            <span className="text-lg font-semibold">
                              {release.downloads.toLocaleString()}
                            </span>
                          </td>

                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {release.fileSize}
                          </td>

                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <span suppressHydrationWarning>
                              {release.releaseDate.toLocaleDateString()}
                            </span>
                          </td>

                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex space-x-3">
                              <a
                                href={`https://git.vdb.to/cerc-io/mtm-vpn-client-public/releases/tag/${release.tagName}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-800 flex items-center"
                              >
                                View Release
                                <ArrowTopRightOnSquareIcon className="ml-1 h-4 w-4" />
                              </a>
                              <a
                                href={release.downloadUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-green-600 hover:text-green-800 flex items-center"
                              >
                                Download APK
                                <CloudArrowDownIcon className="ml-1 h-4 w-4" />
                              </a>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="px-6 py-8 whitespace-nowrap text-sm text-gray-500 text-center">
                          <div className="flex flex-col items-center">
                            <DevicePhoneMobileIcon className="h-12 w-12 text-gray-400" />
                            <h3 className="mt-2 text-sm font-medium text-gray-900">No Releases Found</h3>
                            <p className="mt-1 text-sm text-gray-500">
                              No Android app releases are currently available.
                            </p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}