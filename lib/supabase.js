import { createClient } from '@supabase/supabase-js';

// This URL is confirmed from your dashboard
const supabaseUrl = 'https://pzzueppkzfkxntunrmoy.supabase.co'; 

// REPLACE the text below with the key you just copied
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB6enVlcHBremZreG50dW5ybW95Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEwNjI0MzEsImV4cCI6MjA4NjYzODQzMX0.JB8o457EmOmo-z0GRaUGzoSFS8aiJeYaTtL4FwP8ZNU';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
