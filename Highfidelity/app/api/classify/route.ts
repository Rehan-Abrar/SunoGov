import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { text, city, language } = body;

    // TODO: Replace with real AI classification logic
    // This is a stub that returns mock data

    const mockResponse = {
      issue: text || "Unclassified issue",
      department: {
        name: "WASA Lahore",
        full_name: "Water and Sanitation Agency",
        reason: "Water supply and sewerage infrastructure falls under WASA jurisdiction.",
      },
      city: city || "Lahore",
      confidence: 0.92,
      channels: [
        { type: "PORTAL", label: "Online Portal", value: "wasa.punjab.gov.pk/complaint" },
        { type: "HELPLINE", label: "Helpline", value: "1334" },
        { type: "EMAIL", label: "Email", value: "complaints@wasa.punjab.gov.pk" },
      ],
      complaint_en: `To,\nThe Executive Director\nWASA\n\nSubject: ${text}\n\n...`,
      complaint_ur: `بخدمت،\nایگزیکٹو ڈائریکٹر\nواسا\n\nموضوع: ${text}\n\n...`,
    };

    return NextResponse.json(mockResponse);
  } catch {
    return NextResponse.json(
      { error: "Failed to classify complaint" },
      { status: 500 }
    );
  }
}
