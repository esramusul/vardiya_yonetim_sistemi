# app/controllers/api/v1/auth_controller.rb
module Api
  module V1
    class AuthController < ApplicationController
      skip_before_action :authorize_request, only: :login

      def login
        email    = params[:email]    || params.dig(:auth, :email)
        password = params[:password] || params.dig(:auth, :password)

        user = User.find_by(email: email)

        if user&.authenticate(password)
          token = jwt_encode(user_id: user.id)
          render json: {
            token: token,
            user: {
              id: user.id,
              email: user.email,
              role: user.role
            }
          }, status: :ok
        else
          render json: { errors: "Invalid email or password" }, status: :unauthorized
        end
      end
    end
  end
end
