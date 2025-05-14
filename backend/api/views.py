from supabase import create_client
url = 'https://wczowfydbgmwbotbxaxa.supabase.co'
key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indjem93ZnlkYmdtd2JvdGJ4YXhhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzUxNzU1MjUsImV4cCI6MjA1MDc1MTUyNX0.5JxhYLqY3q6y2ti9Cn3R6-UBJFisPDOvUYxYQ_DgGSE'  # Make sure you use the correct key
supabase = create_client(url, key)