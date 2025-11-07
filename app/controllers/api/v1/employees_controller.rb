module Api
  module V1
    class EmployeesController < ApplicationController
      before_action :set_employee, only: [:show, :update, :destroy]

      def index
        employees = Employee.includes(:department).all
        render json: employees.as_json(include: :department)
      end

      def show
        render json: @employee.as_json(include: :department)
      end

      def create
        employee = Employee.new(employee_params)
        if employee.save
          render json: employee, status: :created
        else
          render json: { errors: employee.errors.full_messages }, status: :unprocessable_entity
        end
      end

      def update
        if @employee.update(employee_params)
          render json: @employee
        else
          render json: { errors: @employee.errors.full_messages }, status: :unprocessable_entity
        end
      end

      def destroy
        @employee.destroy
        head :no_content
      end

      private

      def set_employee
        @employee = Employee.find(params[:id])
      end

      def employee_params
        params.require(:employee).permit(:full_name, :department_id, :user_id)
      end
    end
  end
end
