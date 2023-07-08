# URL Shortening Service Planning Document

## Project Overview

This project is designed to be a portfolio piece demonstrating proficiency with a variety of technologies and methodologies. The core functionality is to provide a RESTful API for URL shortening and tracking. The API should enable users to submit a URL and receive a shortened version, and to track the usage of the shortened URLs.

## Key Features

- URL shortening
- URL redirection
- Data analytics (click tracking)
- User-specific API keys

## Technology Stack

- TypeScript (NestJS)
- MongoDB (Mongoose ORM)
- Hosting: AWS (tentative)

## API Design

### Endpoints

#### POST api/v1/short

- Description: Creates a shortened URL.
- Request Body: JSON object with a single key-value pair where the key is "url" and the value is the URL to be shortened.
- Response: A JSON object containing the original URL and the shortened URL.

#### GET api/v1/short/:unique_shortened_url

- Description: Redirects to the original URL associated with the unique shortened URL.
- URL Parameters: `unique_shortened_url` - the unique identifier for the shortened URL.
- Response: Redirects to the original URL if it exists and is active; returns a 404 error otherwise.

#### GET api/v1/urls

- Description: Retrieves all URLs associated with the provided API key.
- Query Parameters: `API_KEY` - the API key associated with the user's account.
- Response: Returns a JSON array of URL objects associated with the user's account.

#### PATCH api/v1/urls/:id

- Description: Updates the status of a URL.
- Authentication: Requires an API key included in the request header.
- URL Parameters: `id` - the ID of the URL to update.
- Request Body: A JSON object with the fields to update.
- Response: Returns the updated URL data.

## Database Schema

### Users Model

- API Key
- Array of associated URL IDs

### URLs Model

- Original URL
- Shortened URL
- isActive status
- Number of clicks
- Optional expiration date

## Security and Error Handling

- All connections will be made via HTTPS
- API keys for user authentication
- Rate limiting via third-party provider Upstash
- URL validation with regex

## Performance and Scaling

This is not a primary concern for this project at its current stage. However, there may be consideration of switching to a more performance-oriented language like Go in the future, if necessary.

## Testing

Unit and integration tests will be implemented using Jest.

## Deployment and Maintenance

- Deployment Process: Using GitHub Actions for CI/CD. Code will be moved from development to main branches once all tests pass.
- Environment Management: Separate environments and databases for development, testing, and production.
- Monitoring and Debugging: AWS CloudWatch (if deployed on AWS), or alternative logging provider.
- Rollback Strategy: Automatic redeployment of the last working commit in case of an unexpected failure.

## Future Considerations

- Implementing an expiry feature for URLs.
- User management: Including features for updating API keys, deactivating accounts, or deleting URLs.
- Data privacy and management considerations.
