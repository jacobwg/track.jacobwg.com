require 'yaml'
Settings = YAML.load_file('config/settings.yml')
R = Rosumi.new(Settings['username'], Settings['password'])

class App < Sinatra::Base

  get '/' do
    File.read(File.join('public', 'index.html'))
  end

  get '/location.json' do
    R.updateDevices.last.to_json
  end

end