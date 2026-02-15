# PatriotGo – Carpooling Done Easy, Safe, and Cost-Neutral

A feature-rich carooling app for George Mason University students, done as part of the **PatriotHacks** hackathon.

## Inspiration
- 3/4 of our team are George Mason University students and have experienced firsthand the **challenges of commuting sustainably** while ensuring students can get to campus on time.  
- There was **no existing solution** to maintain **cost-neutrality** for student ridesharing.  
- We wanted to **help students connect socially**, making it easier to find people to carpool with while also **reducing carbon emissions**.  

## What It Does
- **PatriotGo** makes carpooling **easy, safe, and cost-neutral**.  
- Students can create **custom preferences** for who they carpool with (e.g., by major, year, or schedule) to encourage **social connections** alongside commuting.  
- Offers **location-based ride matching**, so students quickly find rides that suit their schedules and neighborhoods.  
- Ensures fair ride sharing: drivers give rides without profit, riders contribute if they can’t drive.  
- Implements a **credit system**: students can **compensate peers** by driving themselves to unlock credits or pay for parts of a ride (gas and parking compensation).

## How We Built It
- **Front End:** Built with **ExpoGo** with **react**, optimized for mobile use accross **any OS**.  
- **Back End:**  
  - **AWS Relational Database Service (RDS)** with **PostgreSQL** to store user info.  
  - **DynamoDB** (planned) for chat interfaces between riders and drivers.  
  - **AWS Cognito** for secure authentication with George Mason University IDs.  
  - **AWS Lambda functions** to process interactions, sessions, and ride matching.  

## Challenges We Ran Into
- Integrating **ExpoGo** with AWS was difficult.  
- Navigating Microsoft authentication to ensure accounts worked and avoided auth errors (first time coding authentication protocols).  
- Implementing **real-time DynamoDB communications**.  
- Navigating **page routing with React**—redirects after authentication were a major pain point.  

## Accomplishments We’re Proud Of
- Built a **working MVP** with essential ride posting and searching functionality.  
- Implemented **location-based queries** for efficient ride matching.  
- Leveraged **AWS 24/7 support** to keep services reliable.  
- App is **deployable to any phone OS**.  
- Designed a **simple, minimal UI** in **Mason colors**.  
- Ensured a **credit system** to maintain cost neutrality.  
- Planned chat feature for social connection (not yet implemented).  

## What We Learned
- Building **student-focused apps requires understanding real user needs**, not just technical features.  
- AWS services like RDS, Lambda, and Cognito are **powerful but require careful planning** to scale and integrate.  
- **Cost-neutrality and social matching** can be a strong differentiator in niche apps like campus carpools.  
- Prioritizing **UI simplicity** dramatically improves user adoption.  

## What’s Next for PatriotGo
- Launch **full chat/messaging feature** to connect riders and drivers.  
- Implement **ride history, ratings, and gamification** to reward sustainable commuting.  
- Expand **preference options** for rides, including schedules and interests.  
- Scale to **support more campuses** while keeping the platform **easy, safe, and cost-neutral**.  
