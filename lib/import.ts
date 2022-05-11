
import { google } from "googleapis";

interface Version {
  major: Number,
  minor: Number
}

const FolderType = "application/vnd.google-apps.folder"

const jwtClient = new google.auth.JWT(
  process.env.SERVICE_ACCOUNT_EMAIL,
  undefined,
  process.env.SERVICE_ACCOUNT_KEY,
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

const parseVersion = (version: String): Version => {
  const [major, minor] = version.split(".").map((s) => Number(s))
  return { major, minor }
}

export default async (version: String) => {
  const ver = parseVersion(version)

  const drive = google.drive({ version: "v3", auth: jwtClient });

  const major_folder = await drive.files.list(
    { q: `name = 'v${ver.major}' and parents in '${process.env.ROOT_FOLDER_ID}' and mimeType = '${FolderType}'` }
  ).then((r) => (r.data.files || [])[0])

  console.log(`Major Folder: ${major_folder?.name} ${major_folder?.id}`)

  const minor_folder = await drive.files.list(
    { q: `name = '.${ver.minor}' and parents in '${major_folder.id}' and mimeType = '${FolderType}'` })
    .then((r) => (r.data.files || [])[0])

  console.log(`Minor Folder: ${minor_folder?.name} ${minor_folder?.id}`)

  const sheet = await drive.files.list(
    { q: `name contains 'cards' and parents in '${minor_folder.id}'` })
    .then((r) => (r.data.files || [])[0])

  if (!sheet) throw new Error(`Could not find the sheet for ${ver}`)

  const buf = await drive.files.export({
    fileId: sheet.id,
    mimeType: "text/csv"
  })

  return buf
}