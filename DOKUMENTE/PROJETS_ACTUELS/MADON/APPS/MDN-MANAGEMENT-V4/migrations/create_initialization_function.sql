CREATE OR REPLACE FUNCTION create_detailed_absences_view()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Création de la vue si elle n'existe pas
  CREATE OR REPLACE VIEW public.detailed_absences AS
  SELECT 
      a.id,
      a.employee_id,
      a.start_date,
      a.end_date,
      a.type,
      a.status,
      a.reason,
      a.days_count,
      a.created_at,
      a.updated_at,
      a.document_url,
      e.first_name,
      e.last_name,
      e.department,
      e.position,
      u.email as updated_by_email
  FROM 
      absences a
      LEFT JOIN employees e ON a.employee_id = e.id
      LEFT JOIN auth.users u ON a.updated_by = u.id;

  -- Attribution des droits
  GRANT SELECT ON public.detailed_absences TO authenticated;
END;
$$; 