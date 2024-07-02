// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { NextResponse } from 'next/server';
type Data = {
  relation: [string];
  target: {
    namespace: string;
    package_name: string;
    sha256_cert_fingerprints: [string];
  };
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data[]>
) {
  res.status(200).json([
    {
      relation: ['delegate_permission/common.handle_all_urls'],
      target: {
        namespace: 'android_app',
        package_name: 'com.healthCareApp',
        sha256_cert_fingerprints: [
          '82:B9:41:BE:34:5F:76:03:D1:1F:C1:66:05:0E:66:AA:BB:1C:6C:2C:74:18:5A:79:EA:E5:6F:28:C0:47:E0:20',
        ],
      },
    },
    {
      relation: ['delegate_permission/common.handle_all_urls'],
      target: {
        namespace: 'android_app',
        package_name: 'com.healthCareApp',
        sha256_cert_fingerprints: [
          '51:BB:40:3C:F9:8F:94:1C:FA:C7:E2:19:2D:D5:EE:87:DF:0D:13:71:E1:91:F4:89:84:F8:0E:C4:C1:8F:9E:A4',
        ],
      },
    },
  ]);
}
