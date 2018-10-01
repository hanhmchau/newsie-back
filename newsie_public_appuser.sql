CREATE TABLE public.appuser
(
    id integer DEFAULT nextval('appuser_id_seq'::regclass) PRIMARY KEY NOT NULL,
    email varchar(255),
    password varchar(255),
    role smallint
);
CREATE UNIQUE INDEX appuser_email_key ON public.appuser (email);
INSERT INTO public.appuser (id, email, password, role) VALUES (7, 'luculia.test4@gmail.com', '$2a$10$9unh980aatoBhP.rJ0ytEOQVygU/cZYmoSYV4j54qx7jtOGVlEDam', 0);
INSERT INTO public.appuser (id, email, password, role) VALUES (1, 'luculia.test1@gmail.com', '$2a$10$bukH.kpuUlyFG7PrhSdUh.1KA3As6fpxAYg/KPrX7Ec1g4CbbQDbu', 1);
INSERT INTO public.appuser (id, email, password, role) VALUES (3, 'luculia.test2@gmail.com', '$2a$10$fBrrej0TYO8JE0ogf8pd0ebbV5BdrHF1wEfWyijoVm9Vqbf1gVQtS', 0);
INSERT INTO public.appuser (id, email, password, role) VALUES (8, 'luculia.test5@gmail.com', '$2a$10$cwmZNLgEWsZI6BL8BQQt4.VXrIPKKfiIskwYncyu8JJxaZB.JuT9K', 1);
INSERT INTO public.appuser (id, email, password, role) VALUES (5, 'luculia.test3@gmail.com', '$2a$10$maKRS9ZhuOAtsPsYIJELj.YCqqiba0BRd0uI6l3Qt72bUEwHT4iom', 1);
INSERT INTO public.appuser (id, email, password, role) VALUES (10, 'luculia.test6@gmail.com', '$2a$10$s0rn6zR3BVcs4/rEx4yMwODE7qO/SKFoJwwYMRnDSd2fRDprvORMO', 1);
CREATE TABLE public.category
(
    id integer DEFAULT nextval('category_id_seq'::regclass) PRIMARY KEY NOT NULL,
    name varchar(50)
);
INSERT INTO public.category (id, name) VALUES (1, 'Music');
INSERT INTO public.category (id, name) VALUES (2, 'Design');
CREATE TABLE public.comment
(
    id integer DEFAULT nextval('comment_id_seq'::regclass) PRIMARY KEY NOT NULL,
    content text,
    postid integer,
    commenterid integer,
    datecommented timestamp,
    CONSTRAINT comment_postid_fkey FOREIGN KEY (postid) REFERENCES public.post (id),
    CONSTRAINT comment_commenterid_fkey FOREIGN KEY (commenterid) REFERENCES public.appuser (id)
);
CREATE TABLE public.favorite
(
    postid integer,
    userid integer,
    CONSTRAINT favorite_postid_fkey FOREIGN KEY (postid) REFERENCES public.post (id),
    CONSTRAINT favorite_userid_fkey FOREIGN KEY (userid) REFERENCES public.appuser (id)
);
CREATE TABLE public.post
(
    id integer DEFAULT nextval('post_id_seq'::regclass) PRIMARY KEY NOT NULL,
    name varchar(100),
    content text,
    categoryid integer,
    datepublished timestamp,
    authorid integer,
    previewimage varchar(255),
    public boolean DEFAULT false,
    CONSTRAINT post_categoryid_fkey FOREIGN KEY (categoryid) REFERENCES public.category (id),
    CONSTRAINT post_authorid_fkey FOREIGN KEY (authorid) REFERENCES public.appuser (id)
);
INSERT INTO public.post (id, name, content, categoryid, datepublished, authorid, previewimage, public) VALUES (1, 'Hello, Great Blue World!', null, 2, null, 10, null, false);
INSERT INTO public.post (id, name, content, categoryid, datepublished, authorid, previewimage, public) VALUES (2, 'Goodbye, Great Red World!', null, 1, '2018-10-01 16:47:49.092000', 10, null, false);
CREATE TABLE public.posttag
(
    postid integer NOT NULL,
    tagid integer NOT NULL,
    CONSTRAINT posttag_pk PRIMARY KEY (postid, tagid),
    CONSTRAINT posttag_postid_fkey FOREIGN KEY (postid) REFERENCES public.post (id),
    CONSTRAINT posttag_tagid_fkey FOREIGN KEY (tagid) REFERENCES public.tag (id)
);
CREATE TABLE public.tag
(
    id integer DEFAULT nextval('tag_id_seq'::regclass) PRIMARY KEY NOT NULL,
    name varchar(50)
);