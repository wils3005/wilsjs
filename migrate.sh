#!/bin/bash

set -aeux

source .env

create_database() {
  psql <<-EOF
    drop database $WILSJS_PGDATABASE;
    drop role $WILSJS_PGUSER;
    create role $WILSJS_PGUSER with login password '$WILSJS_PGPASSWORD';
    create database $$WILSJS_PGDATABASE owner $WILSJS_PGUSER;
EOF
}

create_uuid_extension() {
  psql <<-EOF
    create extension if not exists "uuid-ossp";
EOF
}

create_event_types_table() {
  psql <<-EOF
    create table if not exists event_types (
      id uuid primary key default uuid_generate_v4(),
      created_at timestamp not null default now(),
      updated_at timestamp not null default now(),
      deleted_at timestamp,
      metadata jsonb not null default '{}'::jsonb,
      name text not null unique
    );

    alter table event_types owner to $WILSJS_PGUSER;
EOF
}

create_policies_table() {
  psql <<-EOF
    create table if not exists policies (
      id uuid primary key default uuid_generate_v4(),
      created_at timestamp not null default now(),
      updated_at timestamp not null default now(),
      deleted_at timestamp,
      metadata jsonb not null default '{}'::jsonb,
      name text not null unique
    );

    alter table policies owner to $WILSJS_PGUSER;
EOF
}

create_roles_table() {
  psql <<-EOF
    create table if not exists roles (
      id uuid primary key default uuid_generate_v4(),
      created_at timestamp not null default now(),
      updated_at timestamp not null default now(),
      deleted_at timestamp,
      metadata jsonb not null default '{}'::jsonb,
      name text not null unique
    );

    alter table roles owner to $WILSJS_PGUSER;
EOF
}

create_users_table() {
  psql <<-EOF
    create table if not exists users (
      id uuid primary key default uuid_generate_v4(),
      created_at timestamp not null default now(),
      updated_at timestamp not null default now(),
      deleted_at timestamp,
      metadata jsonb not null default '{}'::jsonb,
      name text not null unique,
      password text not null
      salt text not null
    );

    alter table users owner to $WILSJS_PGUSER;
EOF
}

create_events_table() {
  psql <<-EOF
    create table if not exists events (
      id uuid primary key default uuid_generate_v4(),
      created_at timestamp not null default now(),
      updated_at timestamp not null default now(),
      deleted_at timestamp,
      metadata jsonb not null default '{}'::jsonb
    );

    alter table events owner to $WILSJS_PGUSER;
EOF
}

create_role_policies_table() {
  psql <<-EOF
    create table if not exists role_policies (
      id uuid primary key default uuid_generate_v4(),
      created_at timestamp not null default now(),
      updated_at timestamp not null default now(),
      deleted_at timestamp,
      metadata jsonb not null default '{}'::jsonb,
      role_id uuid not null references roles,
      policy_id uuid not null references policies
    );

    alter table role_policies owner to $WILSJS_PGUSER;
EOF
}

create_user_roles_table() {
  psql <<-EOF
    create table if not exists user_roles (
      id uuid primary key default uuid_generate_v4(),
      created_at timestamp not null default now(),
      updated_at timestamp not null default now(),
      deleted_at timestamp,
      metadata jsonb not null default '{}'::jsonb,
      user_id uuid not null references users,
      role_id uuid not null references roles
    );

    alter table user_roles owner to $WILSJS_PGUSER;
EOF
}

create_admin_user() {
  psql <<-EOF
    insert into users (name, password_hash, password_salt)
    values ('$ADMIN_USERNAME', '$ADMIN_PASSWORD_HASH', '$ADMIN_PASSWORD_SALT');
EOF
}

################################################################################

# create_database
create_uuid_extension
create_event_types_table
create_policies_table
create_roles_table
create_users_table
create_events_table
create_role_policies_table
create_user_roles_table

create_admin_user
