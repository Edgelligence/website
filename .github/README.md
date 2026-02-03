# GitHub Configuration

This directory contains configuration files for the Edgelligence website.

## config.json

The `config.json` file contains organization and social media configuration.

### Structure

```json
{
  "organization": {
    "name": "Organization Name",
    "github": "GitHub organization URL"
  },
  "socialMedia": {
    "platform_name": {
      "url": "Platform URL",
      "icon": "icon identifier",
      "label": "Accessible label"
    }
  }
}
```

### Social Media Platforms

The following platforms are configured:
- **GitHub**: Organization GitHub profile
- **Twitter**: Organization Twitter/X profile  
- **LinkedIn**: Organization LinkedIn company page
- **Instagram**: Organization Instagram profile

### Usage

The website dynamically loads social media links from this configuration file at runtime. To update social media links:

1. Edit the `url` field for the respective platform in `config.json`
2. Rebuild the website with `npm run build`
3. Deploy the updated build

The configuration is fetched when users visit the site, so changes take effect immediately after deployment.

### Adding New Platforms

To add a new social media platform:

1. Add a new entry to the `socialMedia` object in `config.json`:
   ```json
   "platform_name": {
     "url": "https://platform.com/username",
     "icon": "platform_icon_name",
     "label": "Platform Name"
   }
   ```
2. Update the Footer component to support the new platform icon
3. Rebuild and deploy

### Icon Support

The website uses SVG icons from a predefined set. Supported icons:
- github
- twitter
- linkedin
- instagram

For other platforms, you may need to add custom icon definitions in the Footer component.
