User:
- name
- email
- password
- role (influencer | brand)

Influencer:
- userId
- niche (fashion, tech, fitness)
- followers
- engagementRate
- location (city, state, country)
- openToWork (boolean)

Brand:
- userId
- companyName
- industry
- location

Campaign:
- title
- description
- budget
- locationScope (local | state | national)
- brandId

Application:
- influencerId
- campaignId
- status (pending | accepted | rejected)