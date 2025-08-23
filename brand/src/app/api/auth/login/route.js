import { loginUser } from "@/app/actions/auth/auth.actions";

export async function POST(request) {
  const formData = await request.formData();
  console.log("Form Data Received:", Object.fromEntries(formData.entries()));

  try {
    // Call the loginUser function from your actions
    const result = await loginUser(formData);

    // If login is successful, send the response
    if (result.success) {
      return new Response(
        JSON.stringify({
          success: true,
          message: result.message,
          user: result.user,
        }),
        { status: 200 }
      );
    }

    // If login failed, send the failure message
    return new Response(
      JSON.stringify({
        success: false,
        message: result.message,
      }),
      { status: 400 }
    );
  } catch (error) {
    console.error("Login API Error:", error);
    return new Response(
      JSON.stringify({
        success: false,
        message: error.message || "Something went wrong, please try again.",
      }),
      { status: 500 }
    );
  }
}
