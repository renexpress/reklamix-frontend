import React, { useState } from 'react';
import { useGenerationLogs } from '@/hooks/useApi';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { FileText, ChevronLeft, ChevronRight } from 'lucide-react';

const Logs = () => {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useGenerationLogs('', undefined, page, 20);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Generation Logs</h1>
        <p className="text-gray-500 mt-1">View all generation jobs</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            All Generations ({data?.count || 0})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-20 w-full" />
              ))}
            </div>
          ) : data?.results?.length > 0 ? (
            <>
              <div className="space-y-3">
                {data.results.map((log: any) => (
                  <div key={log.id} className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Job #{log.id}</p>
                        <p className="text-sm text-gray-500">
                          User: {log.user_phone || log.user} • {new Date(log.created_at).toLocaleString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                          log.status === 'complete' ? 'bg-green-100 text-green-700' :
                          log.status === 'failed' ? 'bg-red-100 text-red-700' :
                          'bg-yellow-100 text-yellow-700'
                        }`}>
                          {log.status}
                        </span>
                        {log.credits_charged > 0 && (
                          <p className="text-sm text-gray-500 mt-1">{log.credits_charged} credits</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {data.count > 20 && (
                <div className="flex items-center justify-between mt-6 pt-6 border-t">
                  <p className="text-sm text-gray-500">
                    Showing {((page - 1) * 20) + 1} to {Math.min(page * 20, data.count)} of {data.count}
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage(p => Math.max(1, p - 1))}
                      disabled={!data.previous}
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage(p => p + 1)}
                      disabled={!data.next}
                    >
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <p className="text-center text-gray-500 py-8">No generation logs found</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Logs;
