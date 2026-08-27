import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, oldPassword, newPassword } = body;

    if (!email || !oldPassword || !newPassword) {
      return NextResponse.json({ error: 'Email, current password, and new password are required.' }, { status: 400 });
    }

    return NextResponse.json({ 
      success: true, 
      user: {
        id: 'usr_demo_user',
        name: email.split('@')[0].toUpperCase(),
        email: email,
        role: 'admin',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'
      } 
    });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to update password.' }, { status: 500 });
  }
}
