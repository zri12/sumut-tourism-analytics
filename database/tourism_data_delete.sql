-- Hapus seluruh dataset lama sebelum menjalankan tourism_data_seed.sql
begin;
truncate table public.tourism_data restart identity;
commit;
