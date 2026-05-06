import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client using environment variables
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email } = req.body;

  if (!email || !email.includes('@')) {
    return res.status(400).json({ error: 'Invalid email address' });
  }

  // Insert the email into the Supabase 'waitlist' table
  const { data, error } = await supabase
    .from('waitlist')
    .insert([{ email }]);

  if (error) {
    // Code 23505 means the email already exists in the database
    if (error.code === '23505') {
      return res.status(200).json({ message: 'Email already on the waitlist!' });
    }
    return res.status(500).json({ error: 'Failed to join waitlist.' });
  }

  return res.status(200).json({ message: 'Success' });
}