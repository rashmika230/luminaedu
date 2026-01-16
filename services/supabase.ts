
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://fjsxervcehzcqcyqclgb.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZqc3hlcnZjZWh6Y3FjeXFjbGdiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg0ODUyNjksImV4cCI6MjA4NDA2MTI2OX0.AuiN6RlvgsEFIP7CRQBb1Mjjb4UP6i_VjQdcY2a3S68';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
