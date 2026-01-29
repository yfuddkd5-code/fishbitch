-- Create enum for whitelist status
CREATE TYPE public.whitelist_status AS ENUM ('pending', 'approved', 'rejected');

-- Create enum for app roles
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- Create whitelist entries table
CREATE TABLE public.whitelist_entries (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    gm_gn TEXT NOT NULL,
    wallet_address TEXT NOT NULL,
    twitter_handle TEXT NOT NULL,
    reason TEXT NOT NULL,
    status whitelist_status NOT NULL DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user roles table for admin access
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE (user_id, role)
);

-- Enable Row Level Security
ALTER TABLE public.whitelist_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- RLS Policies for whitelist_entries
-- Anyone can insert (public submissions)
CREATE POLICY "Anyone can submit whitelist entry"
ON public.whitelist_entries
FOR INSERT
WITH CHECK (true);

-- Only admins can view all entries
CREATE POLICY "Admins can view all whitelist entries"
ON public.whitelist_entries
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Only admins can update entries
CREATE POLICY "Admins can update whitelist entries"
ON public.whitelist_entries
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for user_roles
CREATE POLICY "Users can view their own roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_whitelist_entries_updated_at
BEFORE UPDATE ON public.whitelist_entries
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();