import { drive_v3, drive } from "@googleapis/drive";
import { JWT } from "google-auth-library";

export class DriveClient {
  private static instance: DriveClient
  private client: drive_v3.Drive
  private constructor() {
    const key = process.env.NODE_ENV == "production" ?
      JSON.parse(process.env.SERVICE_ACCOUNT_KEY || "UNDEFINED") :
      process.env.SERVICE_ACCOUNT_KEY

    const jwtClient = new JWT({
      email: process.env.SERVICE_ACCOUNT_EMAIL,
      key,
      scopes: [
        'https://www.googleapis.com/auth/spreadsheets',
        'https://www.googleapis.com/auth/drive',
      ]
    })

    jwtClient.authorize(function (err, tokens) {
      if (err) {
        console.log(err);
        return;
      } else {
        console.log(`Successfully connected! Creds expire in ${tokens?.expiry_date}`);
      }
    })

    this.client = drive({ version: "v3", auth: jwtClient });
  }

  public static getInstance() {
    if (!DriveClient.instance) {
      DriveClient.instance = new DriveClient();
    }
    return DriveClient.instance;
  }

  public drive() { return this.client }
}
