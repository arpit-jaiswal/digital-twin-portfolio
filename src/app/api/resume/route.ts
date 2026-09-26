import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
  const filePath = path.join(process.cwd(), "content", "resume.pdf");

  let file: Buffer;
  try {
    file = fs.readFileSync(filePath);
  } catch {
    return NextResponse.json(
      { error: "Resume not found. Add content/resume.pdf." },
      { status: 404 },
    );
  }

  return new NextResponse(new Uint8Array(file), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": "inline; filename=resume.pdf",
    },
  });
}
