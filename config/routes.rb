Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
      post 'auth/login', to: 'auth#login'

      resources :departments
      resources :employees
      resources :shift_templates
      resources :shifts do
        resources :shift_assignments, only: [:index, :create, :destroy]
      end
    end
  end
end
