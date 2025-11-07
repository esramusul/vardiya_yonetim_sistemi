class ApplicationController < ActionController::API
  include JsonWebToken

  before_action :authorize_request

  attr_reader :current_user

  private

  def authorize_request
    header = request.headers['Authorization']
    header = header.split(' ').last if header

    begin
      decoded = jwt_decode(header) if header
      @current_user = User.find(decoded[:user_id])
    rescue ActiveRecord::RecordNotFound, JWT::DecodeError
      render json: { errors: 'Unauthorized' }, status: :unauthorized
    end
  end

  # işte eksik olan bu 👇
  def require_admin!
    unless @current_user && @current_user.role == "admin"
      render json: { errors: 'Forbidden' }, status: :forbidden
    end
  end
end
