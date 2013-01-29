set :application, 'track-jacob'
set :repository,  'https://github.com/jacobwg/track-jacob.git'

role :web, 'quorra.jacobwg.com'
role :app, 'quorra.jacobwg.com'

set :user, 'web'

set :deploy_to, '/data/apps/websites/track.jacobwg.com/'

set :deploy_via, :remote_cache

set :shared_paths, ['config/settings.yml']

set :scm, :git
set :branch, :master

set :use_sudo, false
