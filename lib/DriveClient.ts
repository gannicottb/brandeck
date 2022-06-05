import { drive_v3, google } from "googleapis";

export class DriveClient {
  private static instance: DriveClient
  private client: drive_v3.Drive
  private constructor() {
    const key = process.env.NODE_ENV == "production" ?
      JSON.parse(process.env.SERVICE_ACCOUNT_KEY || "UNDEFINED") :
      process.env.SERVICE_ACCOUNT_KEY

    const jwtClient = new google.auth.JWT(
      process.env.SERVICE_ACCOUNT_EMAIL,
      undefined,
      key,
      ['https://www.googleapis.com/auth/spreadsheets',
        'https://www.googleapis.com/auth/drive',
      ]
    )

    jwtClient.authorize(function (err, tokens) {
      if (err) {
        console.log(err);
        return;
      } else {
        console.log("Successfully connected!");
      }
    })

    this.client = google.drive({ version: "v3", auth: jwtClient });
  }

  public static getInstance() {
    if (!DriveClient.instance) {
      DriveClient.instance = new DriveClient();
    }
    return DriveClient.instance;
  }

  public drive() { return this.client }
}
