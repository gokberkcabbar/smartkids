/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-misused-promises */
import cloudinary from 'cloudinary';
import { Files, IncomingForm } from 'formidable';
import { NextApiRequest, NextApiResponse } from 'next';
import { parse } from 'url';

export const config = {
  api: {
    bodyParser: false,
  },
};

cloudinary.v2.config({ 
    cloud_name: 'dkqt9cxba', 
    api_key: '912967318262769', 
    api_secret: 'BbtzaecFUjGZ7B8qGeDRpEu9f5M' 
  });

export default function handler(req: NextApiRequest, res: NextApiResponse){
  if (req.method === 'POST') {
    const form = new IncomingForm();

    form.parse(req, async (err, fields, files: Files) => {
      if (err) {
        return res.status(500).json({ error: 'File upload failed.' });
      }

      const filePath = files.file![0]!.filepath
      
      try {
        const uploadResult = await cloudinary.v2.uploader.upload(filePath, {resource_type: "auto"});
        res.status(200).json({ urlCloud: uploadResult.url });
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'File upload to Cloudinary failed.' });
      }
    });
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
}
