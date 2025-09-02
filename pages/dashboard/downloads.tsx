import { 
  CloudArrowDownIcon, 
  DevicePhoneMobileIcon,
  ArrowTopRightOnSquareIcon,
} from '@heroicons/react/24/outline';
import Layout from '../../components/Layout';
import { mockAppDownloads } from '../../data/mockData';

export default function Downloads() {
  // Filter to only Android apps
  const androidApps = mockAppDownloads.filter(app => app.platform === 'Android');
  const totalDownloads = androidApps.reduce((sum, app) => sum + app.downloads, 0);

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
                      {totalDownloads.toLocaleString()}
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
                        Platform
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
                    {androidApps
                      .sort((a, b) => new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime())
                      .map((app, index) => (
                        <tr key={app.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {app.version}
                          </td>
                          
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <div className="flex items-center">
                              <DevicePhoneMobileIcon className="h-5 w-5 text-gray-400 mr-2" />
                              {app.platform}
                            </div>
                          </td>

                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            <span className="text-lg font-semibold">
                              {app.downloads.toLocaleString()}
                            </span>
                          </td>

                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {app.fileSize}
                          </td>

                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <span suppressHydrationWarning>
                              {app.releaseDate.toLocaleDateString()}
                            </span>
                          </td>

                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <a
                              href={`https://git.vdb.to/cerc-io/mtm-vpn-client-public/releases/tag/${app.version}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-800 flex items-center"
                            >
                              View Release
                              <ArrowTopRightOnSquareIcon className="ml-1 h-4 w-4" />
                            </a>
                          </td>
                        </tr>
                      ))}
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