import { NextResponse } from "next/server";

// BẮT BUỘC: Ép Next.js hiểu đây là route tĩnh để nó chạy lúc build
export const dynamic = "force-static";

export async function GET() {
  try {
    const adminToken = process.env.PLAYER4ME_API_TOKEN;
    if (!adminToken) {
      return NextResponse.json({ error: "Missing token" }, { status: 500 });
    }

    // Trong static export, chúng ta không thể dùng query params (?page=1)
    // vì lúc build làm gì có ai gửi request. Chúng ta lấy trang mặc định.
    const res = await fetch(`https://player4me.com/api/v1/video/manage`, {
      headers: {
        "api-token": adminToken,
        Accept: "application/json",
      },
    });

    if (!res.ok) throw new Error("Failed to fetch");

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
