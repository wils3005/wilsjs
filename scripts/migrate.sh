#!/bin/sh

[ "${PGDATABASE:?}" ]
[ "${PGHOST:?}" ]
[ "${PGPASSWORD:?}" ]
[ "${PGUSER:?}" ]

[ "${NEW_PGUSER:?}" ]
[ "${NEW_PGPASSWORD:?}" ]

psql <<-EOF
  drop database $NEW_PGUSER;
  drop role $NEW_PGUSER;
  create role $NEW_PGUSER with login password 'NEW_PGPASSWORD';
  create database $NEW_PGUSER owner $NEW_PGUSER;
EOF

export PGDATABASE=$NEW_PGUSER

psql <<-EOF
  create extension if not exists "uuid-ossp";

  create table if not exists event_types (
    id uuid primary key,
    created_at timestamp not null default now(),
    updated_at timestamp not null default now(),
    deleted_at timestamp,
    metadata jsonb not null default '{}'::jsonb,
    name text not null unique
  );
  alter table event_types owner to $NEW_PGUSER;

  create table if not exists policies (
    id uuid primary key,
    created_at timestamp not null default now(),
    updated_at timestamp not null default now(),
    deleted_at timestamp,
    metadata jsonb not null default '{}'::jsonb,
    name text not null unique
  );
  alter table policies owner to $NEW_PGUSER;

  create table if not exists roles (
    id uuid primary key,
    created_at timestamp not null default now(),
    updated_at timestamp not null default now(),
    deleted_at timestamp,
    metadata jsonb not null default '{}'::jsonb,
    name text not null unique
  );
  alter table roles owner to $NEW_PGUSER;

  create table if not exists users (
    id uuid primary key,
    created_at timestamp not null default now(),
    updated_at timestamp not null default now(),
    deleted_at timestamp,
    metadata jsonb not null default '{}'::jsonb,
    name text not null unique,
    password text not null
  );
  alter table users owner to $NEW_PGUSER;

  create table if not exists events (
    id uuid primary key,
    created_at timestamp not null default now(),
    updated_at timestamp not null default now(),
    deleted_at timestamp,
    metadata jsonb not null default '{}'::jsonb
  );
  alter table events owner to $NEW_PGUSER;

  create table if not exists role_policies (
    id uuid primary key,
    created_at timestamp not null default now(),
    updated_at timestamp not null default now(),
    deleted_at timestamp,
    metadata jsonb not null default '{}'::jsonb,
    role_id uuid not null references roles,
    policy_id uuid not null references policies
  );
  alter table role_policies owner to $NEW_PGUSER;

  create table if not exists user_roles (
    id uuid primary key,
    created_at timestamp not null default now(),
    updated_at timestamp not null default now(),
    deleted_at timestamp,
    metadata jsonb not null default '{}'::jsonb,
    user_id uuid not null references users,
    role_id uuid not null references roles
  );
  alter table user_roles owner to $NEW_PGUSER;
EOF
