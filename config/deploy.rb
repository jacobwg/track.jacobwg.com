require 'bundler/capistrano'

set :application, 'track-jacob'
set :repository,  'https://github.com/jacobwg/track-jacob.git'

role :web, 'quorra.jacobwg.com'
role :app, 'quorra.jacobwg.com'

set :user, 'web'

set :deploy_to, '/data/apps/websites/track.jacobwg.com/'

set :deploy_via, :remote_cache

set :shared_children, shared_children + %w{config/settings.yml}

set :scm, :git
set :branch, :master

set :use_sudo, false


namespace :deploy do
  task :start do ; end
  task :stop do ; end
  task :restart, :roles => :app, :except => { :no_release => true } do
    run "#{try_sudo} touch #{File.join(current_path,'tmp','restart.txt')}"
  end
end