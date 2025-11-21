--
-- PostgreSQL database dump
--

\restrict eg9S0m2FgZp3FpkGlqvjOQ74i6f2pKu1fMnuxv4xgQGgt4C1RRtJeyNEB4Blwy9

-- Dumped from database version 18.0
-- Dumped by pg_dump version 18.0

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: enum_todos_priority; Type: TYPE; Schema: public; Owner: dev_user
--

CREATE TYPE public.enum_todos_priority AS ENUM (
    'low',
    'medium',
    'high'
);


ALTER TYPE public.enum_todos_priority OWNER TO dev_user;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: SequelizeMeta; Type: TABLE; Schema: public; Owner: dev_user
--

CREATE TABLE public."SequelizeMeta" (
    name character varying(255) NOT NULL
);


ALTER TABLE public."SequelizeMeta" OWNER TO dev_user;

--
-- Name: categories; Type: TABLE; Schema: public; Owner: dev_user
--

CREATE TABLE public.categories (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    color character varying(7) DEFAULT '#3B82F6'::character varying,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.categories OWNER TO dev_user;

--
-- Name: categories_id_seq; Type: SEQUENCE; Schema: public; Owner: dev_user
--

CREATE SEQUENCE public.categories_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.categories_id_seq OWNER TO dev_user;

--
-- Name: categories_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: dev_user
--

ALTER SEQUENCE public.categories_id_seq OWNED BY public.categories.id;


--
-- Name: todos; Type: TABLE; Schema: public; Owner: dev_user
--

CREATE TABLE public.todos (
    id integer NOT NULL,
    title character varying(255) NOT NULL,
    description text,
    completed boolean DEFAULT false,
    category_id integer,
    priority public.enum_todos_priority DEFAULT 'medium'::public.enum_todos_priority,
    due_date timestamp with time zone,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.todos OWNER TO dev_user;

--
-- Name: todos_id_seq; Type: SEQUENCE; Schema: public; Owner: dev_user
--

CREATE SEQUENCE public.todos_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.todos_id_seq OWNER TO dev_user;

--
-- Name: todos_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: dev_user
--

ALTER SEQUENCE public.todos_id_seq OWNED BY public.todos.id;


--
-- Name: categories id; Type: DEFAULT; Schema: public; Owner: dev_user
--

ALTER TABLE ONLY public.categories ALTER COLUMN id SET DEFAULT nextval('public.categories_id_seq'::regclass);


--
-- Name: todos id; Type: DEFAULT; Schema: public; Owner: dev_user
--

ALTER TABLE ONLY public.todos ALTER COLUMN id SET DEFAULT nextval('public.todos_id_seq'::regclass);


--
-- Data for Name: SequelizeMeta; Type: TABLE DATA; Schema: public; Owner: dev_user
--

COPY public."SequelizeMeta" (name) FROM stdin;
20251121064736-create-categories.js
20251121064752-create-todos.js
\.


--
-- Data for Name: categories; Type: TABLE DATA; Schema: public; Owner: dev_user
--

COPY public.categories (id, name, color, created_at) FROM stdin;
18	coba 1	#1890ff	2025-11-22 01:19:16.36+07
19	ngoding	#eb2f96	2025-11-22 01:19:25.247+07
20	makan	#f5222d	2025-11-22 01:19:46.903+07
\.


--
-- Data for Name: todos; Type: TABLE DATA; Schema: public; Owner: dev_user
--

COPY public.todos (id, title, description, completed, category_id, priority, due_date, created_at, updated_at) FROM stdin;
15	beli ayam geprek	\N	f	20	high	2025-11-22 07:00:00+07	2025-11-22 01:21:04.203+07	2025-11-22 01:22:13.371+07
\.


--
-- Name: categories_id_seq; Type: SEQUENCE SET; Schema: public; Owner: dev_user
--

SELECT pg_catalog.setval('public.categories_id_seq', 20, true);


--
-- Name: todos_id_seq; Type: SEQUENCE SET; Schema: public; Owner: dev_user
--

SELECT pg_catalog.setval('public.todos_id_seq', 16, true);


--
-- Name: SequelizeMeta SequelizeMeta_pkey; Type: CONSTRAINT; Schema: public; Owner: dev_user
--

ALTER TABLE ONLY public."SequelizeMeta"
    ADD CONSTRAINT "SequelizeMeta_pkey" PRIMARY KEY (name);


--
-- Name: categories categories_name_key; Type: CONSTRAINT; Schema: public; Owner: dev_user
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_name_key UNIQUE (name);


--
-- Name: categories categories_pkey; Type: CONSTRAINT; Schema: public; Owner: dev_user
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_pkey PRIMARY KEY (id);


--
-- Name: todos todos_pkey; Type: CONSTRAINT; Schema: public; Owner: dev_user
--

ALTER TABLE ONLY public.todos
    ADD CONSTRAINT todos_pkey PRIMARY KEY (id);


--
-- Name: todos_category_id; Type: INDEX; Schema: public; Owner: dev_user
--

CREATE INDEX todos_category_id ON public.todos USING btree (category_id);


--
-- Name: todos_completed; Type: INDEX; Schema: public; Owner: dev_user
--

CREATE INDEX todos_completed ON public.todos USING btree (completed);


--
-- Name: todos_created_at; Type: INDEX; Schema: public; Owner: dev_user
--

CREATE INDEX todos_created_at ON public.todos USING btree (created_at);


--
-- Name: todos_priority; Type: INDEX; Schema: public; Owner: dev_user
--

CREATE INDEX todos_priority ON public.todos USING btree (priority);


--
-- Name: todos_title; Type: INDEX; Schema: public; Owner: dev_user
--

CREATE INDEX todos_title ON public.todos USING btree (title);


--
-- Name: todos todos_category_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: dev_user
--

ALTER TABLE ONLY public.todos
    ADD CONSTRAINT todos_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.categories(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- PostgreSQL database dump complete
--

\unrestrict eg9S0m2FgZp3FpkGlqvjOQ74i6f2pKu1fMnuxv4xgQGgt4C1RRtJeyNEB4Blwy9

