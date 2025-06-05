//Example

import { NextResponse } from 'next/server';

export const GET = async () => {
  try {
    //  Simulate fetching data
    const users = [
      { id: 1, name: 'John Doe' },
      { id: 2, name: 'Jane Smith' },
    ];

    //  Return the data as JSON
    return NextResponse.json({ users });
  } catch (error) {
    console.error('Error fetching users:', error);
    return new NextResponse("Internal Server Error", {
      status: 500,
    });
  }
};