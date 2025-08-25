// Charts removed for compatibility
import { 
  CloudArrowDownIcon, 
  DevicePhoneMobileIcon,
  ComputerDesktopIcon,
  ArrowTopRightOnSquareIcon,
} from '@heroicons/react/24/outline';
import Layout from '../../components/Layout';
import ProtectedRoute from '../../components/ProtectedRoute';
import { mockAppDownloads } from '../../data/mockData';

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

export default function Downloads() {
  // Calculate summary stats
  const totalDownloads = mockAppDownloads.reduce((sum, app) => sum + app.downloads, 0);
  const androidDownloads = mockAppDownloads.filter(app => app.platform === 'Android').reduce((sum, app) => sum + app.downloads, 0);
  const iosDownloads = mockAppDownloads.filter(app => app.platform === 'iOS').reduce((sum, app) => sum + app.downloads, 0);
  
  // Platform distribution data
  const platformData = mockAppDownloads.reduce((acc, app) => {
    const existing = acc.find(item => item.platform === app.platform);
    if (existing) {
      existing.downloads += app.downloads;
    } else {
      acc.push({ platform: app.platform, downloads: app.downloads });
    }
    return acc;
  }, [] as { platform: string; downloads: number }[]);

  // Growth trend data (simulated)
  const growthData = [
    { month: 'Mar', downloads: 156 },
    { month: 'Apr', downloads: 289 },
    { month: 'May', downloads: 445 },
    { month: 'Jun', downloads: 623 },
    { month: 'Jul', downloads: 892 },
    { month: 'Aug', downloads: totalDownloads },
  ];

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'Android':
      case 'iOS':
        return DevicePhoneMobileIcon;
      default:
        return ComputerDesktopIcon;
    }
  };

  const getFileSize = (sizeString: string) => {
    const match = sizeString.match(/(\d+(?:\.\d+)?)\s*(MiB|MB|GiB|GB)/);
    if (!match) return 0;
    
    const size = parseFloat(match[1]);
    const unit = match[2];
    
    // Convert to MB for comparison
    switch (unit) {
      case 'GiB':
      case 'GB':
        return size * 1024;
      case 'MiB':
      case 'MB':
      default:
        return size;
    }
  };

  return (
    <ProtectedRoute>
      <Layout>
        <div>
          <div className="sm:flex sm:items-center">
            <div className="sm:flex-auto">
              <h1 className="text-2xl font-semibold text-gray-900">App Downloads</h1>
              <p className="mt-2 text-sm text-gray-700">
                Monitor MTM VPN application download metrics across all platforms.
              </p>
            </div>
          </div>

          {/* Summary Stats */}
          <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-3">
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

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <DevicePhoneMobileIcon className="h-8 w-8 text-green-500" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Android Downloads
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {androidDownloads.toLocaleString()}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <DevicePhoneMobileIcon className="h-8 w-8 text-gray-500" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        iOS Downloads
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {iosDownloads.toLocaleString()}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Charts */}
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Downloads by Version */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Downloads by Version</h3>
                <div className="h-80 flex items-end justify-between space-x-1 border-b border-l border-gray-200 p-4">
                  {mockAppDownloads.map((app, index) => (
                    <div key={app.id} className="flex-1 flex flex-col items-center">
                      <div 
                        className="w-full bg-blue-500 rounded-t transition-all duration-500"
                        style={{ 
                          height: `${(app.downloads / Math.max(...mockAppDownloads.map(a => a.downloads))) * 100}%`,
                          minHeight: '4px'
                        }}
                      />
                      <div className="mt-2 text-xs text-gray-500 font-medium transform -rotate-45 origin-center whitespace-nowrap">
                        {app.version.replace('v', '').replace('-mtm-', ' ')}
                      </div>
                      <div className="text-xs text-gray-400 mt-6">{app.downloads}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Platform Distribution */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Platform Distribution</h3>
                <div className="h-80 flex flex-col justify-center space-y-4">
                  {platformData.map((platform, index) => {
                    const percentage = (platform.downloads / totalDownloads) * 100;
                    const colors = ['bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-red-500', 'bg-purple-500'];
                    return (
                      <div key={platform.platform} className="flex items-center">
                        <div className="w-24 text-sm font-medium text-gray-900">{platform.platform}</div>
                        <div className="flex-1 mx-4">
                          <div className="w-full bg-gray-200 rounded-full h-4">
                            <div 
                              className={`h-4 rounded-full ${colors[index % colors.length]} transition-all duration-700`}
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                        <div className="w-20 text-sm text-gray-500 text-right">
                          {platform.downloads.toLocaleString()} ({percentage.toFixed(1)}%)
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Growth Trend */}
          <div className="mt-8 bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Download Growth Trend</h3>
              <div className="h-80 border-b border-l border-gray-200 p-4 relative">
                <div className="absolute inset-0 flex items-end justify-between p-4">
                  {growthData.map((data, index) => {
                    const height = (data.downloads / Math.max(...growthData.map(d => d.downloads))) * 100;
                    const prevHeight = index > 0 ? (growthData[index - 1].downloads / Math.max(...growthData.map(d => d.downloads))) * 100 : height;
                    return (
                      <div key={data.month} className="flex-1 flex flex-col items-center relative">
                        {index > 0 && (
                          <svg className="absolute w-full h-full" style={{ zIndex: 1 }}>
                            <line
                              x1="0"
                              y1={`${100 - prevHeight}%`}
                              x2="100%"
                              y2={`${100 - height}%`}
                              stroke="#10B981"
                              strokeWidth="3"
                            />
                          </svg>
                        )}
                        <div 
                          className="w-3 h-3 bg-green-500 rounded-full relative z-10"
                          style={{ 
                            marginBottom: `${height}%`,
                          }}
                        />
                        <div className="mt-2 text-xs text-gray-500 font-medium">{data.month}</div>
                        <div className="text-xs text-gray-400">{data.downloads.toLocaleString()}</div>
                      </div>
                    );
                  })}
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
                      {mockAppDownloads
                        .sort((a, b) => new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime())
                        .map((app, index) => {
                          const PlatformIcon = getPlatformIcon(app.platform);
                          return (
                            <tr key={app.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                {app.version}
                              </td>
                              
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                <div className="flex items-center">
                                  <PlatformIcon className="h-5 w-5 text-gray-400 mr-2" />
                                  {app.platform}
                                </div>
                              </td>

                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                <div className="flex items-center">
                                  <span className="text-lg font-semibold">
                                    {app.downloads.toLocaleString()}
                                  </span>
                                  <div className="ml-3 w-16 bg-gray-200 rounded-full h-2">
                                    <div 
                                      className="bg-blue-600 h-2 rounded-full"
                                      style={{ 
                                        width: `${Math.min((app.downloads / Math.max(...mockAppDownloads.map(a => a.downloads))) * 100, 100)}%` 
                                      }}
                                    />
                                  </div>
                                </div>
                              </td>

                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {app.fileSize}
                              </td>

                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {app.releaseDate.toLocaleDateString()}
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
                          );
                        })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Metrics */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Top Performing Version */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Top Performing Version</h3>
                {(() => {
                  const topVersion = mockAppDownloads.reduce((max, app) => 
                    app.downloads > max.downloads ? app : max
                  );
                  return (
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-500">Version</p>
                        <p className="text-xl font-bold text-gray-900">{topVersion.version}</p>
                        <p className="text-sm text-gray-500">{topVersion.platform}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-500">Downloads</p>
                        <p className="text-xl font-bold text-blue-600">{topVersion.downloads.toLocaleString()}</p>
                        <p className="text-sm text-gray-500">
                          {((topVersion.downloads / totalDownloads) * 100).toFixed(1)}% of total
                        </p>
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>

            {/* Average File Size */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">File Size Distribution</h3>
                <div className="space-y-3">
                  {mockAppDownloads.map((app) => (
                    <div key={app.id} className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">
                        {app.version} ({app.platform})
                      </span>
                      <span className="text-sm font-medium text-gray-900">
                        {app.fileSize}
                      </span>
                    </div>
                  ))}
                  <div className="pt-3 border-t border-gray-200">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-900">Average Size</span>
                      <span className="text-sm font-medium text-blue-600">
                        {(mockAppDownloads.reduce((sum, app) => sum + getFileSize(app.fileSize), 0) / mockAppDownloads.length).toFixed(1)} MiB
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </ProtectedRoute>
  );
}