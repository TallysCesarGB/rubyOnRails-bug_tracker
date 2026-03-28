Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
      post 'login', to: 'sessions#create'
      resources :users
      resources :projects
      resources :bugs do
        resources :comments, only: [:index, :create, :destroy]
      end
    end
  end
end