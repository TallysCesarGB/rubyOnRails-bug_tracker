class ApplicationController < ActionController::API
  rescue_from ActiveRecord::RecordNotFound do |e|
    render json: { error: "Registro não encontrado", detail: e.message }, status: :not_found
  end

  rescue_from ActiveRecord::RecordInvalid do |e|
    render json: { error: "Dados inválidos", detail: e.message }, status: :unprocessable_entity
  end

  private

  def json_error(message, status = :bad_request)
    render json: { error: message }, status: status
  end
end