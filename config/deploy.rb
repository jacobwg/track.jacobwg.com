set :application, 'track-jacob'
set :repository,  'https://github.com/jacobwg/track-jacob.git'

role :web, 'quorra.jacobwg.com'
role :app, 'quorra.jacobwg.com'

set :user, 'web'

set :deploy_to, '/data/apps/websites/track.jacobwg.com/'

set :use_sudo, false

set :shared_children, shared_children + %w{public/js/settings.js}

namespace :deploy do
  task :migrate do
  end
  task :finalize_update do
    run "#{try_sudo} cp #{File.join(shared_path, 'config', 'settings.yml')} #{File.join(current_path, 'config', 'settings.yml')}"
  end
  task :start do
  end
  task :stop do
  end
  task :restart do
  end
end

# if you want to clean up old releases on each deploy uncomment this:
# after "deploy:restart", "deploy:cleanup"

# if you're still using the script/reaper helper you will need
# these http://github.com/rails/irs_process_scripts

# If you are using Passenger mod_rails uncomment this:
# namespace :deploy do
#   task :start do ; end
#   task :stop do ; end
#   task :restart, :roles => :app, :except => { :no_release => true } do
#     run "#{try_sudo} touch #{File.join(current_path,'tmp','restart.txt')}"
#   end
# end