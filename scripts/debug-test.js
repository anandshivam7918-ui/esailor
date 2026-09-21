import { sanityClient } from '../src/lib/sanity.js';
import projectConfig from '../sanity.config.js';

console.log('Starting debug test...');

try {
  console.log('Importing sanityClient...');
  console.log('sanityClient imported successfully');

  console.log('Importing projectConfig...');
  console.log('projectConfig imported successfully:', {
    projectId: projectConfig.projectId,
    dataset: projectConfig.dataset
  });

  console.log('Testing connection...');
  sanityClient.fetch('count(*[_type == "category"])')
    .then(count => {
      console.log('✅ Successfully connected to Sanity CMS');
      console.log(`📊 Found ${count} categories in the dataset`);

      return sanityClient.request({
        uri: '/',
        method: 'GET'
      });
    })
    .then(projectInfo => {
      console.log(`📋 Project: ${projectInfo.projectId}`);
      console.log(`📂 Dataset: ${projectConfig.dataset}`);
      console.log('Debug test completed successfully!');
    })
    .catch(err => {
      console.error('❌ Error:', err.message);
      console.error('Error stack:', err.stack);
    });
} catch (err) {
  console.error('❌ Import error:', err.message);
  console.error('Error stack:', err.stack);
}